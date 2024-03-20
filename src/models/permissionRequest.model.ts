import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PermissionsRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  canDeactivate?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  canActivate?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  canCreate?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  canView?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  canEdit?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  canList?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  canDelete?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  tenantId?: string;
}
