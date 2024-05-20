// 定义 Options 类型
interface Option {
    value: string;
    label: string;
}

// 使用类型注解限定参数类型
const Dropdown = ({ options, value, onChange, label = "请选择批次" }: { 
    options: Option[], 
    value: Option | null, 
    onChange: (value: string) => void,
    label: string
}) => {
    return (
        <select value={value ? value.value : ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">{label}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;
export type { Option };