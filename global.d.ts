declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.css' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.less' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.svg' {
  import React = require('react')

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.gif'
declare module '*.jpg'
declare module '*.png'