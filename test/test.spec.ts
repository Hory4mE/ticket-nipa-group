import assert from "assert";
import { describe } from "mocha";

describe("Test", function () {
    describe("test-argument", function () {
        it("should be true cause ITS TRUE", function () {
            assert.equal(1, true);
        });

        it("should call res.json on successful db query", () => {});
        it("should call res.status with 422 and then res.json on error", () => {});
    });
});
