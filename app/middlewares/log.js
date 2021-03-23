exports.apiCount = (role) => async (req, res, next,) => {
    sdc.increment(`${role}.int`, 1);
    console.log(role);
    next();
}
