// user 테이블과 mapping되는 model 생성
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        user_id: {
            type: DataTypes.STRING(30),
            allowNull: false,
            primaryKey: true
        },
        user_pwd: {
            type: DataTypes.STRING(20)
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        profile: {
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        google_id: {
            type: DataTypes.STRING(40),
            defaultValue: null
        } 
    }, {
        timestamps: false,
        charset: 'utf8'
    });
};