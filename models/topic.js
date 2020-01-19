// topic 테이블과 mapping되는 model 생성
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('topic', {
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
    }, {
        timestamps: false,
        charset: 'utf8'
    });
};