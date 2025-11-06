using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeatherAppApi.Migrations
{
    /// <inheritdoc />
    public partial class AddFavoriteLocations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LocationName",
                table: "FavoriteLocations",
                newName: "City");

            migrationBuilder.AddColumn<DateTime>(
                name: "AddedOn",
                table: "FavoriteLocations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddedOn",
                table: "FavoriteLocations");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "FavoriteLocations",
                newName: "LocationName");
        }
    }
}
