using Club.Core.Dtos;
using Club.Repository.Data.Context;
using Club.Service.Interface;

namespace Club.Service.Implementation
{
    public class FileUploadService : IFileUploadService
    {
        private readonly ClubContext _context;

        public FileUploadService(ClubContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<string>> UploadProfileImageAsync(byte[] fileBytes, string fileName, string appUserId)
        {
            if (fileBytes.Length == 0)
                return ApiResponse<string>.Fail("No file provided.");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var ext = Path.GetExtension(fileName)?.ToLowerInvariant();

            if (ext is null || !allowedExtensions.Contains(ext))
                return ApiResponse<string>.Fail("Only .jpg, .jpeg, .png, and .webp files are allowed.");

            if (fileBytes.Length > 5 * 1024 * 1024)
                return ApiResponse<string>.Fail("File size must be less than 5 MB.");

            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
            Directory.CreateDirectory(uploadsDir);

            var uniqueName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsDir, uniqueName);

            await File.WriteAllBytesAsync(filePath, fileBytes);

            var relativeUrl = $"/uploads/profiles/{uniqueName}";

            var profile = await _context.UserProfiles.FindAsync(appUserId);
            if (profile is not null)
            {
                profile.ImageUrl = relativeUrl;
                await _context.SaveChangesAsync();
            }

            return ApiResponse<string>.Ok(relativeUrl, "Profile image uploaded successfully");
        }
    }
}