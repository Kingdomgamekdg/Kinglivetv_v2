export type PropsButtonBSC = {
  text?: string | undefined | null,
  icon?: string,
  id?: string,
  left?: any,
  right?: any,
  className?: string,
  type?: 'submit' | 'reset' | 'button',
  ghost?: boolean,
  loading?: boolean,
  primary?: boolean,
  link?: boolean,
  gray?: boolean,
  href?: string,
  disabled?:boolean,
  hide?:boolean,
  click?: (params: any) => void
}

export type RefButtonBSC = {
  click?: (params: any) => void
}