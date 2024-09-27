import buttonEffect from '../../assets/images/btn-effect.png'
import './Button.css'

export type ButtonVariant = 'primary' | 'success' | 'danger' | 'warning'
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm'
  variant?: ButtonVariant
  btnInnerClassName?: string
}
export const Button = ({
  children,
  className,
  variant = 'primary',
  btnInnerClassName,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant} button ${className ?? ''}`}
      {...props}
    >
      <span className={btnInnerClassName ?? ''}>{children}</span>
      <img src={buttonEffect} className='effect' alt='' />
    </button>
  )
}
export default Button
