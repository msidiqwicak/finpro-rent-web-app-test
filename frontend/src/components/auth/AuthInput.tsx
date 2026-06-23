import { Link } from "react-router-dom";

export interface TogglePass {
  show: boolean;
  onClick: () => void;
}

export interface AuthInputProps {
  id: string;
  label: string;
  icon: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  togglePass?: TogglePass;
}

const INPUT_CLS =
  "w-full pl-11 pr-11 py-3.5 bg-surface border border-outline-variant rounded-xl text-[15px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60";

export default function AuthInput(props: AuthInputProps) {
  return (
    <div className="mb-5 relative">
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={props.id}
          className="block text-[12px] font-bold uppercase tracking-wider text-on-surface-variant"
        >
          {props.label}
        </label>
        {props.togglePass && (
          <Link
            to="/forgot-password"
            className="text-[12px] font-bold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        )}
      </div>
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-4 text-outline text-[20px]">
          {props.icon}
        </span>
        <input
          id={props.id}
          name={props.id}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          className={INPUT_CLS}
        />
        {props.togglePass && (
          <button
            type="button"
            onClick={props.togglePass.onClick}
            className="absolute right-4 text-outline hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-[20px]">
              {props.togglePass.show ? "visibility_off" : "visibility"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
