const { response } = require("express");
const { validationResult } = require("express-validator");
const { models } = require("mongoose");
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({email: email});

        if( existeEmail){
            return res.status(400).json({
                ok: false,
                msg: "El correo ya esta registrado!!"
            });
        }

        const usuario = new Usuario( req.body );

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt )

        await usuario.save();

        const token = await generarJWT( usuario.id )

        res.json({
            ok: true,
            msg: 'Crear ususario!!!!',
            body: usuario,
            token
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "hable con el administrador"
        });
    }


}

const login = async ( req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB){
            return res.status(400).json({
                ok: false,
                msg: "email no encontrado"
            })
        }

        //validar password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password)
        if( !validPassword){
            return res.status(400).json({
                ok: false,
                msg: "password incorrecta"
            })
        }

        const token = await generarJWT( usuarioDB.id);

        res.json({
            ok: true,
            body: usuarioDB,
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "hable con el administrador"
        })
    }
}

const renewToken = async( req, res = response) => {

    const uid = req.uid;

    // generar un nuevo JWT, generarJWT... uid...
    const token = await generarJWT( uid );

    // Obtener el usuario por el UID, Usuario.findById...
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    });

}

module.exports = {
    crearUsuario,
    login,
    renewToken
}