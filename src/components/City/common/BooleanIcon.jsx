import { GoodtIcon, BadIcon } from "./Icons"
import style from "./BooleanIcon.module.scss";

export const BooleanIcon = ({ value }) => {
  return (
    <div className={ style.icon }>
      { value
        ? <GoodtIcon className="icon" />
        : <BadIcon />
      }
    </div>
  )
}