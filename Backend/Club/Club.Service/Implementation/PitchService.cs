using AutoMapper;
using Club.Core.Dtos;
using Club.Core.Dtos.Pitch;
using Club.Core.Entities;
using Club.Repository.Interface;
using Club.Service.Interface;

namespace Club.Service.Implementation
{
    public class PitchService : IPitchService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PitchService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ApiResponse<PitchDto>> CreatePitchAsync(CreatePitchDto dto)
        {
            var existing = (await _unitOfWork.Pitches.GetAllAsync())
                .Any(p => p.Number == dto.Number);
            if (existing)
                    return ApiResponse<PitchDto>.Fail("This pitch number is already in use. Please choose a different number.");

            var pitch = _mapper.Map<Pitch>(dto);
            await _unitOfWork.Pitches.AddAsync(pitch);
            await _unitOfWork.CompleteAsync();

            var created = await _unitOfWork.Pitches.GetByIdWithIncludesAsync(
                pitch.Id, p => p.Bookings);

            return ApiResponse<PitchDto>.Ok(
                _mapper.Map<PitchDto>(created ?? pitch),
                "Pitch created successfully");
        }

        public async Task<ApiResponse<IEnumerable<PitchDto>>> GetAllPitchesAsync()
        {
            var pitches = await _unitOfWork.Pitches.GetAllWithIncludesAsync(p => p.Bookings);

            return ApiResponse<IEnumerable<PitchDto>>.Ok(
                _mapper.Map<IEnumerable<PitchDto>>(pitches),
                "Pitches retrieved successfully");
        }

        public async Task<ApiResponse<PagedResult<PitchDto>>> GetAllPitchesPagedAsync(int page, int pageSize, string? search = null)
        {
            var paged = await _unitOfWork.Pitches.GetAllPagedAsync(page, pageSize,
                includes: p => p.Bookings);

            return ApiResponse<PagedResult<PitchDto>>.Ok(
                new PagedResult<PitchDto>
                {
                    Items = _mapper.Map<List<PitchDto>>(paged.Items),
                    TotalCount = paged.TotalCount,
                    Page = paged.Page,
                    PageSize = paged.PageSize,
                },
                "Pitches retrieved successfully");
        }

        public async Task<ApiResponse<PitchDto>> GetPitchByIdAsync(int id)
        {
            var pitch = await _unitOfWork.Pitches.GetByIdWithIncludesAsync(
                id, p => p.Bookings);

            if (pitch is null)
                return ApiResponse<PitchDto>.Fail("The pitch could not be found. Please check the pitch number and try again.");

            return ApiResponse<PitchDto>.Ok(
                _mapper.Map<PitchDto>(pitch),
                "Pitch retrieved successfully");
        }

        public async Task<ApiResponse<PitchDto>> UpdatePitchAsync(int id, UpdatePitchDto dto)
        {
            var pitch = await _unitOfWork.Pitches.GetByIdWithIncludesAsync(
                id, p => p.Bookings);

            if (pitch is null)
                return ApiResponse<PitchDto>.Fail("The pitch could not be found. Please check the pitch number and try again.");

            if (dto.Number.HasValue)
            {
                var exists = (await _unitOfWork.Pitches.GetAllAsync())
                    .Any(p => p.Number == dto.Number.Value && p.Id != id);
                if (exists)
                return ApiResponse<PitchDto>.Fail("This pitch number is already in use. Please choose a different number.");
            }

            _mapper.Map(dto, pitch);
            _unitOfWork.Pitches.Update(pitch);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<PitchDto>.Ok(
                _mapper.Map<PitchDto>(pitch),
                "Pitch updated successfully");
        }

        public async Task<ApiResponse<bool>> DeletePitchAsync(int id)
        {
            var pitch = await _unitOfWork.Pitches.GetByIdWithIncludesAsync(
                id, p => p.Bookings);

            if (pitch is null)
                return ApiResponse<bool>.Fail("Pitch not found");

            var nowUtc = DateTime.UtcNow;
            var hasFutureBooking = pitch.Bookings.Any(b =>
                b.Date > nowUtc.Date ||
                (b.Date == nowUtc.Date && b.StartTime > nowUtc.TimeOfDay));

            if (hasFutureBooking)
                return ApiResponse<bool>.Fail("Cancel all future bookings before deleting this pitch.");

            _unitOfWork.Pitches.Delete(pitch);
            await _unitOfWork.CompleteAsync();

            return ApiResponse<bool>.Ok(true, "Pitch deleted successfully");
        }
    }
}