module.exports = {
    isOwner: function(req, res) {
        if (req.user) {
          return true;
        } else {
          return false;
        }
    },
    statusUI: function(req, res) {
        var authStatusUI = `<a href="/auth/login">login</a> | <a href="/auth/register">register</a>`;

        if (this.isOwner(req, res)) {
          authStatusUI = `${req.user.name} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
};