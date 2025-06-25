module.exports = () => {
    var today = new Date();
    const month = today.getMonth()+1
    const year = today.getFullYear()
    const edition = month>6 ?  year+1 : year
    return edition 
} 