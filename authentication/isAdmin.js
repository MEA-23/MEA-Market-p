

async function adminAccess(req, res, next) {
    const dataObj = req.obj;
    if (dataObj) {
        if (dataObj.admin == 0) {
            req.admin = true;
            console.log('adminAccess generated')
        } else {
            req.admin = false;
            console.log('adminAccess denied')
        }
    }
    
    next();
}

module.exports = adminAccess;