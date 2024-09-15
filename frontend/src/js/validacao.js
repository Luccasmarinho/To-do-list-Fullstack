function validarCampo(campo, background = "#dc2626") {

    if (campo == "") {
        Toastify({
            text: "O campo não pode estar vazio.",
            duration:1500,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: `${background}`,
            },
            onClick: function () { } 
        }).showToast();
    }
}

export default validarCampo