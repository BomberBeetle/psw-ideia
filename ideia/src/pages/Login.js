import "../css/Login.css"

export default function Login(){
    return (
    <form>
    <div class="container">
      <label for="unome"><b>Email</b></label>
      <input type="text" placeholder="Email" name="unome" required/>

      <label for="psw"><b>Senha</b></label>
      <input type="password" placeholder="Senha" name="psw" required/>
        
      <button type="submit">Login</button>
      <label>
        <input type="checkbox" checked="checked" name="lembre"/> Lembre-se de mim
      </label>
    </div>
  </form>
    )
}