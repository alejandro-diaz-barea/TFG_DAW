<template>
    <footer class="footer">
        <a class="footerFacebook"><img src="../../../assets/facebook.png" alt="Logo de facebook" class="FacebookLogo"></a>
        <a class="footerInstagram"><img src="../../../assets/instagram.png" alt="Logo de instagram" class="InstagramLogo"></a>
        <a href="#" class="footerX"><img src="../../../assets/gorjeo.png" alt="Logo de x" class="XLogo"></a>
        <a href="#" class="footerYoutube"><img src="../../../assets/youtube.png" alt="Logo de youtube" class="YoutubeLogo"></a>
        <div class="footer__copyright">
          <p  class="footer__copyright_p">
            © 2024 EaseSell. Todos los derechos reservados.
            </p>
        </div>
    </footer>
  </template>
  
  <style scoped>
  .footer{
    background-color: rgba(39, 110, 144, 0.4);
    color: #000000;
    padding: 0.75rem 2.1875rem; 
    height: 11.328vh;
    display: flex;
    justify-content: center; 
    align-items: center;
    font-family: 'Doppio One';    
    bottom: 0;
  }
  
  .footerFacebook{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 5.9375rem;
    padding-left: 7.5rem;
  }
  
  .FacebookLogo{
    height: 1.875rem;
    width: 1.875em;
  }
  
  .footerInstagram, .footerX, .footerYoutube{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 5.9375rem;
    padding-left: 1.25rem;
  }
  
  .InstagramLogo,  .YoutubeLogo {
    height: 1.875rem;
    width: 1.875rem;
  }
  
  .XLogo{
    width: 1.875rem;
    height: 1.625rem;
  }
  
  .footer__copyright{
    margin-left: 8rem;
    display: flex;
  }
  
  .footer__copyright_p {
    text-align: center;  
    font-size: 1.25rem;
  }
  
  
  /* Media query para 1300 */
  @media screen and (max-width: 1300px) {
    .footerFacebook{
      padding-left: 0;
    }
    
  
    .footer__copyright{
      margin-left: 6rem;
      display: flex;
    }
    
    .footer__copyright_p {
      text-align: center;  
      font-size: 1rem;
    }
  }
  
  /* Media query para 951 */
  @media screen and (max-width: 951px) {
    .footerFacebook{
      padding-left: 0;
    }
    
  
    .footer__copyright{
      margin-left: 6rem;
      display: flex;
    }
    
    .footer__copyright_p {
      text-align: center;  
      font-size: 0.8rem;
    }
  }
  
  
  
  /* Media query para 500 */
  @media screen and (max-width: 500px) {
  
    .footer__copyright{
      margin-left: 3rem;
      display: none;
    }
   
  }
  </style>
  