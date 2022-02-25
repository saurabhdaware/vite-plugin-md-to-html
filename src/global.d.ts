declare module "*.md" {
  export const html: string;
  export const attributes: Record<string, any>;
  export default html;
}
