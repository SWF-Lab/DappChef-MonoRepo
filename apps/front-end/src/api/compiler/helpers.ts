export const createCompileInput = (
  contractBody: string,
  options: any = {}
): string => {
  const CompileInput = {
    language: "Solidity",
    sources: {
      Compiled_Contracts: {
        content: contractBody
      }
    },
    settings: {
      ...options,
      outputSelection: {
        "*": {
          "*": ["*"]
        }
      }
    }
  }
  return JSON.stringify(CompileInput)
}
