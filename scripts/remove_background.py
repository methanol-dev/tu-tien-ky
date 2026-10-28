"""
Script bóc tách nền trắng thành PNG trong suốt cho Sprite nhân vật
Sử dụng Pillow với thuật toán flood-fill từ 4 góc và viền biên để tránh làm mất các đốm trắng/sáng bên trong nhân vật.
"""
import sys
import os
from PIL import Image, ImageFilter

def remove_white_background(input_path, output_path, tolerance=30, edge_feather=True):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Tạo bản sao grayscale để phân tích mask
    # Với nền trắng (R, G, B > 255 - tolerance)
    datas = img.getdata()
    
    # Thuật toán: Tạo mask nhị phân từ nền
    # Flood-fill từ các điểm biên để đảm bảo chỉ xóa nền bên ngoài
    from collections import deque
    
    mask = Image.new("L", (width, height), 255) # 255: nhân vật (giữ lại), 0: nền (xóa)
    pixels = img.load()
    mask_pixels = mask.load()
    
    visited = bytearray(width * height)
    queue = deque()
    
    # Khởi tạo queue từ tất cả pixel ở 4 cạnh biên nếu chúng gần màu trắng
    def is_bg(r, g, b, a):
        # Trắng hoặc gần trắng (ví dụ > 230)
        return r >= (255 - tolerance) and g >= (255 - tolerance) and b >= (255 - tolerance)

    for x in range(width):
        for y in [0, height - 1]:
            idx = y * width + x
            r, g, b, a = pixels[x, y]
            if is_bg(r, g, b, a) and not visited[idx]:
                visited[idx] = 1
                queue.append((x, y))
                mask_pixels[x, y] = 0

    for y in range(height):
        for x in [0, width - 1]:
            idx = y * width + x
            r, g, b, a = pixels[x, y]
            if is_bg(r, g, b, a) and not visited[idx]:
                visited[idx] = 1
                queue.append((x, y))
                mask_pixels[x, y] = 0

    # BFS loang ra khắp vùng nền ngoài
    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                n_idx = ny * width + nx
                if not visited[n_idx]:
                    visited[n_idx] = 1
                    nr, ng, nb, na = pixels[nx, ny]
                    if is_bg(nr, ng, nb, na):
                        mask_pixels[nx, ny] = 0
                        queue.append((nx, ny))

    # Làm mượt biên (feathering) nhẹ để tránh viền thô
    if edge_feather:
        # Áp dụng gaussian blur nhẹ cho mask để viền mềm mại
        mask_blur = mask.filter(ImageFilter.GaussianBlur(radius=0.8))
        img.putalpha(mask_blur)
    else:
        img.putalpha(mask)

    # Autocrop phần viền rỗng thừa xung quanh
    bbox = img.getbbox()
    if bbox:
        # Thêm padding nhẹ 4px
        x1, y1, x2, y2 = bbox
        x1 = max(0, x1 - 4)
        y1 = max(0, y1 - 4)
        x2 = min(width, x2 + 4)
        y2 = min(height, y2 + 4)
        img = img.crop((x1, y1, x2, y2))

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Background removed successfully: {output_path} (Size: {img.size})")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_background.py <input_img> <output_png> [tolerance]")
        sys.exit(1)
    in_file = sys.argv[1]
    out_file = sys.argv[2]
    tol = int(sys.argv[3]) if len(sys.argv) > 3 else 32
    remove_white_background(in_file, out_file, tol)
