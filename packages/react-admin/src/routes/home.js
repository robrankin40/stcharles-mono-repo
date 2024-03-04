import { useForm } from "react-hook-form";

import logo from '../logo.svg';
import { useLoginMutation } from "../store/api/authApi";

function HomePage() {
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm()

  const [login, result] = useLoginMutation()
  
  const onSubmit = async (data) => {
    login({ email: data.email, password: data.password })
  }

  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h4>Please login to St Charles Automotive Agent Admin portal</h4>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register('email', { required: true })} />
        {errors.email && <span className="error">Please check email again</span>}
        <input type="password" {...register('password', { required: true, minLength: 7 })} />
        {errors.password && <span className="error">Please check password again</span>}
        {result.isError && <span className="error">Invalid Credentials</span>}
        <input type="submit" value="Log In" disabled={result.isLoading} />
      </form>
    </header>
  );
}

export default HomePage;
