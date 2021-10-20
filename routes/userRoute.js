const fs = require('fs')
const {
    join
} = require('path')



//path para o usuário
const filePath = join(__dirname, 'users.json')


//verifica se o usuário ja existe, caso contrário, cria um novo usuário
const getUsers = () => {
    const data = fs.existsSync(filePath) ? fs.readFileSync(filePath) : []

    try {
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

//salva os dados do usuário
const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'))

//get = puxa os dados do usuarío e exporta em um objeto
//post = insere um novo usuário no path fs
const userRoute = (app) => {
    app.route('/users/:id?')
        .get((req, res) => {
            const users = getUsers()

            res.send({
                users
            })
        })
        .post((req, res) => {
            const users = getUsers()

            users.push(req.body)
            saveUser(users)
            res.status(201).send('OK')
        })
        .put((req, res) => {

            const users = getUsers()

            saveUser(users.map(user => {
                if (user.id === req.params.id) {
                    return {
                        ...user,
                        ...req.body
                    }
                }
                return user
            }))
            res.status(200).send('OK')

        })
        .delete((req, res) => {
            const users = getUsers()
            saveUser(users.filter(user => user.id !== req.params.id))
            res.status(200).send('OK')
        })
}
module.exports = userRoute;