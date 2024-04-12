<template>
    <section>
      <h1 class="titulo">Contact us</h1>
      <input type="email" class="campo-input campo-email" placeholder="Email" v-model="email" @focusout="validarEmail"/>
      <p v-if="!emailValido" class="mensaje-error">{{ emailError }}</p>
      <textarea class="campo-input campo-texto" placeholder="Write a message ..." v-model="texto" @focusout="validarTexto"></textarea>
      <p v-if="!textoValido" class="mensaje-error"> Por favor ingrese al menos 10 caracteres. </p>
      <button class="boton-enviar" @click="enviarFormulario">Enviar</button>
      <p v-if="enviadoConExito" class="mensaje-exito">Entregado con éxito!</p>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: "",
        texto: "",
        emailValido: true,
        textoValido: true,
        enviadoConExito: false,
        emailError: "Por favor ingrese un email válido.",
      };
    },
    methods: {
      enviarFormulario() {
        this.validarEmail();
        this.validarTexto();
        if (this.emailValido && this.textoValido) {
          console.log("Formulario válido, enviando...");
          this.enviadoConExito = true;
          //resetear formulario despues de 2 segundos
          setTimeout(() => {
            this.resetearFormulario();
          }, 2000);
        }
      },
      validarEmail() {
        if (this.email === "") {
          this.emailValido = false;
          this.emailError = "Por favor ingrese su correo electrónico.";
        } else {
          this.emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
          this.emailError = "Por favor ingrese un email válido.";
        }
      },
      validarTexto() {
        if (this.texto.trim() === "") {
          this.textoValido = false;
        } else {
          const textoSinEspacios = this.texto.replace(/\s/g, "");
          this.textoValido = textoSinEspacios.length >= 10;
        }
      },
      resetearFormulario() {
        this.email = "";
        this.texto = "";
        this.emailValido = true;
        this.textoValido = true;
        this.enviadoConExito = false;
      },
    },
  };
  </script>
  
  



<style scoped>

</style>
