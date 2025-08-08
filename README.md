# securite-web 🔐
Installation et configuration serveur nginx:
  $user_rtwoka: sudo apt update
  $user_rtwoka: sudo apt install nginx -y

Active service nginx:
  $user_rtwoka: sudo systemctl start nginx
  $user_rtwoka: sudo systemctl enable nginx
  _status serveur:
  $user_rtwoka: sudo systemctl status nginx
  _visite site:
  navigateur: http://localhost

Creer un dossier dans /var/www/repository
Creer un site statique(home.html & home.css home.js) et met le dans repository

Configurer nginx pour votre site
  $user_rtwoka: sudo nvim /etc/nginx/sites-avalaible/repository

met y:
server {
    listen 80;
    server_name repository.local;
    root /var/www/repository;
    index home.html;

    location / {
        try_files $uri $uri/ =404;
    }

}

Creer lien symbolique pour site:
$user_rtwoka: sudo ln -s /etc/nginx/sites-available/monsite /etc/nginx/sites-enabled/

Parametrer nom de domaine local
  $user_rtwoka: sudo nvim /etc/hosts
  modifier 127.0.0.1 localhost 
  en 127.0.0.1 repository.local
 
enregistrer et quiter.
Navigate to http://repository.local

Creer un machine virtuel pour essayer de visiter notre site en le configurant en même réseau 

Openssl pour generer clé sécurité.
Installer sur le machine host et sur le machine virtuel CA

  $user_rtwoka: sudo apt install openssl -y

Sur le machine hôte creer un clé privé pour notre site.
  $user_rtwoka: openssl genrsa -out site.key 2048

Puis créer un fichier de configuration SAN(subjectAltName) pour le CSR(Certificate Signing Request).

  $user_rtwoka: nvim site_csr.cnf
  met y:

[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = req_ext

[dn]
C = MD
ST = Local
L = Local
O = IG1
OU = IT
CN = repository.local

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = repository.local

Générer CSR avec le fichier de configuration SAN(subjectAltName).
<--le fichier SAN occupe l'entré de données-->

  $user_rtwoka: openssl req -new -key site.key -out site.csr -config site_csr.cnf

Ok si tout marche bien.
Envoi le le fichier site.csr dans le machine CA pour être signer.

Sur le machine CA: intaller aussi Openssl

généré un cle CA ca.key et ca.crt pour la certification.

$user_rtwoka: openssl genrsa -out ca.key 4096

$user_rtwoka: openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt

Avant de signé le CSR(certificate signing request)
Creer un fichier v3_ext.cnf
met y:
--
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = repository.local

--

puis signé le CSR
 $user_rtwoka: openssl x509 -req -in site.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out site.crt -days 365 -extfile v3_ext.cnf

Envoie la clé de certification dans le machine hôte et reconfigurer /etc/nginx/sites-avalaible/repository pour passer en https.

server {
    listen 443 ssl;
    server_name repository.local;

    ssl_certificate /etc/nginx/ssl/site.crt;
    ssl_certificate_key /etc/nginx/ssl/site.key;

    root /var/www/repository;
    index home.html;

}

Voir le statut de nginx pour savoir si tout marche bien et rafraîchir : 
  $user_rtwoka: sudo nginx -t
  $user_rtwoka: sudo systemctl reload nginx


Assuré que le pc client et le hôte soit en même réseau

Ajouter une configuration c:/windows/system32/drivers/etc/hosts pour repository.local
met y en bas:

ip_adress repository.local

enregistrer et quitter


Essayer de consulter votre site via navigateur https://repository.local

Si tout est ok le cadenas de sécurité doit apparaître😁
 


