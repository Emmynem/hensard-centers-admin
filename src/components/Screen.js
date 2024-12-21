export default function Screen(props){
    return (
        <div className="screen" xui-aside={props.aside} xui-navbar={props.navbar}>
            {props.children}
        </div>
    );
}