using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EntryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Entries_CategoryId",
                table: "Entries",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Entries_Categories_CategoryId",
                table: "Entries",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entries_Categories_CategoryId",
                table: "Entries");

            migrationBuilder.DropIndex(
                name: "IX_Entries_CategoryId",
                table: "Entries");
        }
    }
}
