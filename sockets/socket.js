const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controller/sockets');

// Mensajes de Sockets
io.on('connection', client => {

    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    //Verificar autenticacion
    if (!valido) { return client.disconnect(); }

    //Cliente autenticado
    usuarioConectado(uid);

    //Ingresar al usuario a una sala
    client.join(uid);

    //Escuchar del cliente mensaje-personal
    client.on('mensaje-personal', async(payload) => {
        await grabarMensaje(payload)
        io.to(payload.para).emit('mensaje-personal', payload);
    })

    console.log('Cliente Autenticado');

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });
});