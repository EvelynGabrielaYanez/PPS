import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ERRORS } from '../utils/constants'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private router: Router;
  private dataService:DataService;
  private loadingCtrl: LoadingController;
  private login: FormGroup;
  private toastController: ToastController;
  constructor(toastController: ToastController, formBuilder: FormBuilder,
    router: Router, dataService: DataService, loadingCtrl: LoadingController) {
    this.router = router;
    this.dataService = dataService;
    this.loadingCtrl = loadingCtrl;
    this.login = formBuilder.group({
      name: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.minLength(4), Validators.maxLength(8), Validators.pattern(/^\d+$/)]],
    });
    this.toastController = toastController;
  }

  public getValidatorErrorWithNumeric(propName: string) {
    const message = this.getValidatorError(propName)
    return 'pattern' == message ? 'La contraseña debe ser numerica' : message;
  }

  /**
   * Método encargado de validar si hay un error en el control del formulario
   * @param propName Nombre de la pripiedad
   * @returns true si hay error y false si no hay
   */
  public hasFrmControlError(propName: string) {
    const property = this.login.get(propName) ;
    if(!property || !property?.errors) return false;
    const porpertyError = Object.getOwnPropertyNames(property?.errors).pop();
    return porpertyError && porpertyError.length > 0;
  }

  /**
   * Método encargado de Validar el usuario
   * @returns
   */
  public submitForm() {
    this.LoginValidate(this.login.controls.name.value, this.login.controls.password.value)
  }

  /**
   * Método encargado de validar si existe u error y setearlo
   * @param porpertiName nombre de la propiedad del controlador del formulario
   * @returns false en caso de no haber propiedad y el string del error en caso de haberlo
   */
  public getValidatorError(porpName: string) : boolean | string {
    if(!this.hasFrmControlError(porpName)) return false;
    const property = this.login.get(porpName) ;
    const porpertyError = Object.getOwnPropertyNames(property?.errors).pop();
    if(!porpertyError) return false;
    const errorMessage = ERRORS.find(({ type }) => porpertyError == type )?.message ?? porpertyError;
    console.log(porpertyError);
    return errorMessage;
  }

  /**
   * Setea los campos con validacion de usuario valido
   */
  public SetFrmValidUser() {
    this.login.controls.name.setValue("evelyn@gmail.com");
    this.login.controls.password.setValue("123456");
  }

  /**
   * Setea los campos con validacion de usuario invalido
   */
  public SetFrmInvalidUser() {
    this.login.controls.name.setValue("usuarioInvalido");
    this.login.controls.password.setValue("AAAAAAAA");
  }

  /**
   * Setea los campos con validacion de usuario invalido
   */
  public SetFrmNotFind() {
    this.login.controls.name.setValue("noRegistrado@gmail.com");
    this.login.controls.password.setValue("12345677");
  }

  /**
   * Metodo encargado de validar el log del usuario
   * @param userMail
   * @param password
   */
  async LoginValidate(userMail: string, userPassword: string) {
    try {
    await this.presentLoading(null);
    this.dataService.getUsers().subscribe(async usuarios => {
      if(usuarios.find(({email, password}) => email === userMail && userPassword == password)) {
        await this.loadingCtrl.dismiss();
        this.router.navigate(['/home']);
      }
      else {
        await this.loadingCtrl.dismiss();
        await this.presentToast('Correo o contraseña invalido.');
      }
    });
    } catch (error: any){
      console.error(error.message + error.stack);
    }
  }

  /**
   * Método encargado de disparar la pantalla de loading
   * @returns
   */
  async presentLoading(message: string | null) {
    if(message) return (await this.loadingCtrl.create({ message })).present();
    return (await this.loadingCtrl.create()).present();
  }

  ngOnInit() {
    // TODO document why this method 'ngOnInit' is empty
  }

  /**
   * Método encargado de presentar un Toast por pantalla
   */
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      header: message,
      duration: 2000,
      cssClass: 'toast-custom-class',
      translucent: true
    });
    toast.present();
  }

  ionViewDidEnter() {
    SplashScreen.hide();
  }
}
