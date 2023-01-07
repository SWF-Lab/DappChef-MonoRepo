export const contractDoc = `
// SPDX-License-Identifier: MIT

contract HelloWorld {
    string public greet = "Hello World!";
}

contract SimpleStorage {
    uint storedData;
    function set(uint x) public {
        storedData = x;
    }
    function get() public view returns (uint) {
        return storedData;
    }
}
`
