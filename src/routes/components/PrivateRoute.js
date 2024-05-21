import { Redirect, Route } from "react-router-dom";


function PrivateRoute(props) {
    const {component: Component, ...rest} = props
    const isLogin = localStorage.getItem("isLogin")
    

    return (
        <Route 
            {...rest}
            render={prop => {
                if (isLogin === "true") {
                    return <Component {...prop}/>
                } else {
                    return <Redirect to="/"/>
                }
            }}
        />
    )
}

export default PrivateRoute
