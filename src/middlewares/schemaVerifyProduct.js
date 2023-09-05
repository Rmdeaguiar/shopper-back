const yup = require('./settings')

const schemaVerifyProduct = yup.object().shape({
    code: yup.number().required('O código é obrigatório'),
    newPrice: yup.string().required('O novo preço é obrigatório')
})

module.exports = schemaVerifyProduct