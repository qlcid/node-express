//user 테이블과 mapping되는 model 생성
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        profile: {
            type: DataTypes.STRING(100)
        },
    }, {
        timestamps: false,
        charset: 'utf8'
    });
};