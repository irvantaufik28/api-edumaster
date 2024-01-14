"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateStudentDto = void 0;
const class_validator_1 = require("class-validator");
require("reflect-metadata");
const create_or_update_studentParent_Dto_1 = require("./create-or-update-studentParent.Dto");
const class_transformer_1 = require("class-transformer");
class createOrUpdateStudentDto {
}
exports.createOrUpdateStudentDto = createOrUpdateStudentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "first_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "middle_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "last_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "birth_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "birth_place", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "birth_certificate_no", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "family_identity_no", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "register_year", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "religion", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "origin_academy", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], createOrUpdateStudentDto.prototype, "foto_url", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_or_update_studentParent_Dto_1.CreateOrUpdateStudentParentDto),
    __metadata("design:type", Array)
], createOrUpdateStudentDto.prototype, "student_parents", void 0);
//# sourceMappingURL=create-or-update-student.dto.js.map