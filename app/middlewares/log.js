const lynx = require('lynx');
const metrics = new lynx('localhost', 8125);

exports.apiCount = (role) => async (req, res, next,) => {
    console.log(role);
    switch (role) {
        case "userSignup":
            console.log("ENTER HERE");
            metrics.increment('userSignup.int');
          break;
        case "userSignin":
          text = "On";
          break;
        case "userUpdate":
          text = "On";
          break;
        default:
          text = "No value found";
    } 
    next();
}
