// babel配置项
module.exports = {
  // env 用于设置对应环境下的配置, 在编译的时候babel会根据当前环境变量的值来决定采用哪个配置。
  // env字段的值会从process.env.BABEL_ENV获取，如果BABEL_ENV不存在，
  // 则从process.env.NODE_ENV获取，如果NODE_ENV还不存在，
  // 则取默认值development，使用这样方式进行配置可以定义多个不同的配置项，
  // 同时可以通过环境变量来控制要读取的配置。
  env: {
    development: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: [
              '>1%',
              'last 2 versions',
              'not ie <= 8'
            ]
          }
        ],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    }
  }
}
