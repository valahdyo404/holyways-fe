/**
 *
 * @param {object} state user data
 * @param {object} action type of auth status and user data
 * @returns localstorage access token and isLogin state
 */
export const authReducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case "AUTH_SUCCESS":
    case "LOGIN_SUCCESS":
      localStorage.setItem("accessToken", payload.accessToken)
      localStorage.setItem("isLogin", "true")
      return {
        isLogin: true,
        user: payload,
      }
    case "AUTH_ERROR":
    case "LOGOUT":
      localStorage.removeItem("accessToken")
      localStorage.removeItem("isLogin")
      return {
        isLogin: false,
        user: {},
      }

    default:
      return state
  }
}
