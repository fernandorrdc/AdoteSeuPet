
import { useContext } from "react"
import { Link } from "react-router-dom"
import { Context } from "../../context/UserContext"

import Logo from '../../assets/img/logo.png'
import styles from './Navbar.module.css'

function Navbar() {

    const { authenticated , logout} = useContext(Context)

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt="Adote Seu Pet" />
                <h2>Adote seu Pet</h2>
            </div>
            <ul>
                <li>
                    <Link to="/">Adotar</Link>
                </li>
                {authenticated ? (
                    <> 

                    <li>
                            <Link to="/user/profile">Perfil</Link>
                    </li>

                    <li onClick={logout}>Sair</li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Entrar</Link>
                        </li>

                        <li>
                            <Link to="/register">Cadastrar</Link>
                        </li>
                    </>
                )


                }

            </ul>
        </nav>

    )
}

export default Navbar