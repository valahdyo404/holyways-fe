import { Route, Switch } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute"

import Homepage from "../pages/Homepage"
import Profilepage from "../pages/Profilepage"
import ProfileUpdatepage from "../pages/ProfileUpdatepage"
import DetailDonatepage from "../pages/DetailDonatepage"
import Raisefundpage from "../pages/Raisefundpage"
import Formfundpage from "../pages/Formfundpage"
import ChatDonorpage from "../pages/ChatDonorpage"
import ChatFundraiserpage from "../pages/ChatFundraiserpage"

function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Homepage} />

      <PrivateRoute exact path="/profile" component={Profilepage} />
      <PrivateRoute exact path="/edit-profile" component={ProfileUpdatepage} />
      <PrivateRoute exact path="/chat/:idFund" component={ChatDonorpage} />
      <PrivateRoute
        exact
        path="/chat-fundraiser"
        component={ChatFundraiserpage}
      />
      <PrivateRoute exact path="/fund/:id" component={DetailDonatepage} />
      <PrivateRoute exact path="/raisefund" component={Raisefundpage} />
      <PrivateRoute exact path="/formfund" component={Formfundpage} />

      <Route
        path="*"
        component={() => {
          return (
            <h1 className="display-4 font-weight-bold text-center mt-5">
              404 Not Found
            </h1>
          )
        }}
      />
    </Switch>
  )
}

export default Routes
