async function typeSentence(sentence, delay=100) {
    let eleRef=document.getElementById("sentence");
    const letters= sentence.split("");
    let i= 0;
    while(i< letters.length){
        await waitForMs(delay);
        eleRef.append(letters[i]);
        i++

    }
    return;
}

function waitForMs(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload=(event)=>{
    typeSentence("Topologie Sécurité web");
}