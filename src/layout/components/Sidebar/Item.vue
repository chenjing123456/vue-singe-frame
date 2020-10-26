<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    level: {
      type: Number,
      default: 1
    },
    customizeIcon: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, level, customizeIcon } = context.props
    const vnodes = []
    // console.log(customizeIcon + '-0', icon + '-9')
    if (customizeIcon) {
      // 后台自定义过菜单icon
      let icons = customizeIcon.split(':')
      if (icons[0] == 'line') {
        // color -多样   line -线性
        let iconclass = 'iconfont ' + icons[1]
        vnodes.push(<i class={iconclass} />)
      } else {
        vnodes.push(<svg-icon icon-class={icons[1]} />)
      }
    }

    if (!customizeIcon && icon) { // 使用前端默认填的icon
      if (level === 2) { // 二级菜单 是icon
        let icons1 = 'iconfont ' + icon
        vnodes.push(<i class={icons1}/>)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{title}</span>)
    }
    return vnodes
  }
}
</script>
