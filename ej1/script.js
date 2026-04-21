
const btnCerrar = document.querySelector(".btn-cerrar-panel");
const panel = document.querySelector(".panel-flotante");

if (btnCerrar) {
    btnCerrar.addEventListener("click", function() {
        panel.style.display = "none";
    });
}

let suma=0,n=[];
function jugar(){
    suma=0;n=[];
    let c= document.getElementById("cantidad-numeros").value;
    document.getElementById("resultado").innerText="";
    
    let numeros = [];
    
    for(let i = -10; i <= 20; i++){
        if(i !== 0) numeros.push(i);
    }
    
    for(let i=0; i<c; i++){
        let indiceAleatorio = Math.floor(Math.random() * numeros.length);
        let x = numeros[indiceAleatorio];
        suma += x;
        n.push(x);
        numeros.splice(indiceAleatorio, 1);
    }

    document.getElementById("seccion-config").classList.add("oculto");
    document.getElementById("seccion-juego").classList.remove("oculto");
    mostrar(0);
}

function mostrar(i){
    let d= document.getElementById("display-numeros");
    let tiempoIntervalo = parseInt(document.getElementById("tiempo").value) * 1000;
    
    if(i<n.length){
        d.style.animation = "none";
        d.style.opacity = "0";
        d.innerText=n[i];
        
        setTimeout(() => {
            d.style.animation = "bounce 0.6s ease-out forwards";
        }, 10);
        
        setTimeout(()=>{
            d.style.animation = "fadeOut 0.5s ease-out forwards";
        }, tiempoIntervalo - 500);
        
        setTimeout(()=>{
            d.innerText="";
            d.style.animation = "none";
            d.style.opacity = "1";
            mostrar(i+1);
        }, tiempoIntervalo);
    }else{
        document.getElementById("seccion-juego").classList.add("oculto");
        document.getElementById("seccion-resultados").classList.remove("oculto");
        document.getElementById("seccion-resultados").style.animation = "slideIn 0.5s ease-out";
    }
}
function verificar(){
    let v= document.getElementById("respuesta").value;
    let resultado = document.getElementById("resultado");
    resultado.innerText=(v==suma)?"✓ Correcto":"✗ Incorrecto, la respuesta es "+suma;
    resultado.classList.add((v==suma)?"resultado-correcto":"resultado-incorrecto");
    resultado.style.animation = (v==suma) ? "scaleIn 0.4s ease-out" : "shake 0.5s ease-out";
    document.getElementById("verificar-respuesta").disabled = true;
    document.getElementById("reiniciar-juego").style.display = "inline-block";
}

function reiniciar(){
    document.getElementById("respuesta").value = "";
    document.getElementById("resultado").innerText="";
    document.getElementById("resultado").className="";
    document.getElementById("verificar-respuesta").disabled = false;
    document.getElementById("reiniciar-juego").style.display = "none";
    document.getElementById("seccion-resultados").classList.add("oculto");
    document.getElementById("seccion-config").classList.remove("oculto");
}