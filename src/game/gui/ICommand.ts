export default interface ICommand {
    execute(): Promise<this>;
}