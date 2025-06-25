

(()=>{

    let numberOfParticipants = 1

    function addParticipant () {
        let rows = document.getElementById("rows-container").children
        for (let i=0; i < rows.length; i++) {
            let e = rows[i]
            if (e.hidden) {
                e.hidden = false
                numberOfParticipants ++
                if (numberOfParticipants == 7) {
                    document.getElementById('plus-button').hidden = true
                }
                return
            }
        }
    }
    
    let plusButton = document.getElementById("plus-button")
    plusButton.addEventListener('click', addParticipant)

    for (let i=1; i<8; i++) {
        document.getElementById(`delete-button-${i}`).addEventListener('click', ()=>{
            if (numberOfParticipants==1) {
                alert('il ne peut pas y avoir moins d\'un·e participant·e !')
                return
            }
            let row = document.getElementById(`delete-button-${i}`).parentNode.parentNode
            row.children[0].children[1].children[0].value = ''
            row.children[0].children[1].children[1].value = ''
            row.children[1].children[1].selectIndex = 0
            numberOfParticipants--
            plusButton.hidden = false
            row.parentNode.appendChild(row)
            row.hidden = true
        })
    }


    //############## FORM VALIDATION

    const nom_asso = document.getElementById("nom_asso");
    const nom_respo = document.getElementById("nom_respo");
    const nom_ecole = document.getElementById("nom_ecole");
    const mail_respo = document.getElementById("mail_respo");
    const tel_respo = document.getElementById("tel_respo");
    const moyen_contact = document.getElementById("moyen_contact");
    const moyen_paiement = document.getElementById("moyen_paiement");
    const form = document.getElementById("form");
    const error = document.getElementById("error");
    
    function validateMyForm() {
        let messages = [];
        if ((tel_respo.value === "" || tel_respo.value == null ) && (mail_respo.value === "" || mail_respo.value == null )) {
            messages.push('• Veuillez renseigner soit votre numéro de téléphone soit votre adresse mail de contact.')
        }
        if (nom_asso.value === "" || nom_asso.value == null) {
            messages.push('• Veuillez remplir la case "Nom d\'association".')
        }
        if (nom_ecole.value === "" || nom_ecole.value == null) {
            messages.push('• Veuillez remplir la case "Nom d\'ecole".')
        }
        if (nom_respo.value === "" || nom_respo.value == null) {
            messages.push('• Veuillez remplir la case "Nom du responsable".')
        }
        if (moyen_contact.value === "null" || moyen_contact.value == null) {
            messages.push('• Veuillez sélectionner un choix parmi les moyens de contact.')
        }
        if (moyen_paiement.value === "null" || moyen_paiement.value == null) {
            messages.push('• Veuillez sélectionner un choix parmi les moyens de paiement.')
        }
        if (tel_respo.value.length > 15) {
            messages.push('• Le numéro de téléphone du responsable équipe est trop long.')
        }
        if (nom_respo.value.length > 49) {
            messages.push('• Le nom du responsable équipe est trop long.')
        }
        if (nom_asso.value.length > 49) {
            messages.push("• Le nom de l'asso est trop long.")
        }
        if (nom_ecole.value.length > 49) {
            messages.push("• Le nom de l'école est trop long.")
        }
        return(messages)
        }
    
    form.addEventListener('submit', (e) => {
        error.innerHTML = ""
        messages = validateMyForm()
        errorsNumber = messages.length
        if (errorsNumber != 0) {
            for (i=0; i<errorsNumber; i++) {
                error.innerHTML += messages[i]+'<br/>'
            }
            e.preventDefault()
        } else {
        }
    })

    

})()