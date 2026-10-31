using Club.Core.Dtos;

namespace Club.Service.Interface
{
    public interface IFileUploadService
    {
        Task<ApiResponse<string>> UploadProfileImageAsync(byte[] fileBytes, string fileName, string appUserId);
    }
}