from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from PIL import Image, ImageDraw, ImageFont
import io
import json
import os
from typing import Optional
import piexif
from moviepy.video import VideoClip
import cv2
import numpy as np
from pathlib import Path

router = APIRouter()

class MediaService:
    def __init__(self):
        self.ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/gif', 'image/webp'}
        self.ALLOWED_VIDEO_TYPES = {'video/mp4', 'video/webm', 'video/x-msvideo'}
        self.MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
        
        # Load font for watermarking
        font_path = Path(__file__).parent / "fonts" / "arial.ttf"
        self.font = ImageFont.truetype(str(font_path), 36)

    async def process_watermark(
        self,
        file: UploadFile,
        text: str,
        position: str = "bottom-right",
        opacity: int = 50
    ) -> bytes:
        """Add watermark to image or video"""
        try:
            content = await file.read()
            
            if file.content_type in self.ALLOWED_IMAGE_TYPES:
                return self._watermark_image(content, text, position, opacity)
            elif file.content_type in self.ALLOWED_VIDEO_TYPES:
                return self._watermark_video(content, text, position, opacity)
            else:
                raise ValueError("Unsupported file type")
                
        except Exception as e:
            raise ValueError(f"Watermark failed: {str(e)}")

    def _watermark_image(
        self,
        content: bytes,
        text: str,
        position: str,
        opacity: int
    ) -> bytes:
        """Add watermark to image"""
        img = Image.open(io.BytesIO(content)).convert('RGBA')
        txt = Image.new('RGBA', img.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(txt)

        # Calculate text size using textbbox
        # Get the bounding box of the text
        left, top, right, bottom = draw.textbbox((0, 0), text, font=self.font)
        text_width = right - left
        text_height = bottom - top

        # Calculate position
        padding = 20
        if position == "top-left":
            pos = (padding, padding)
        elif position == "top-right":
            pos = (img.width - text_width - padding, padding)
        elif position == "bottom-left":
            pos = (padding, img.height - text_height - padding)
        elif position == "bottom-right":
            pos = (img.width - text_width - padding, img.height - text_height - padding)
        else:  # center
            pos = ((img.width - text_width) // 2, (img.height - text_height) // 2)

        # Draw watermark
        draw.text(pos, text, font=self.font, fill=(255, 255, 255, int(255 * opacity / 100)))
        
        # Combine images
        watermarked = Image.alpha_composite(img, txt)
        
        # Convert back to original format
        output = io.BytesIO()
        watermarked.convert('RGB').save(output, format='JPEG')
        return output.getvalue()

    def _watermark_video(
        self,
        content: bytes,
        text: str,
        position: str,
        opacity: int
    ) -> bytes:
        """Add watermark to video"""
        # Save temporary video file
        temp_input = "temp_input.mp4"
        temp_output = "temp_output.mp4"
        
        try:
            with open(temp_input, "wb") as f:
                f.write(content)

            # Open video
            video = cv2.VideoCapture(temp_input)
            
            # Get video properties
            width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = video.get(cv2.CAP_PROP_FPS)
            
            # Create video writer
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(temp_output, fourcc, fps, (width, height))

            while True:
                ret, frame = video.read()
                if not ret:
                    break

                # Convert frame to PIL Image
                pil_frame = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                
                # Add watermark
                watermarked_frame = self._watermark_image(
                    cv2.imencode('.jpg', frame)[1].tobytes(),
                    text,
                    position,
                    opacity
                )
                
                # Convert back to OpenCV format
                watermarked_frame = cv2.imdecode(
                    np.frombuffer(watermarked_frame, np.uint8),
                    cv2.IMREAD_COLOR
                )
                
                out.write(watermarked_frame)

            video.release()
            out.release()

            # Read the output file
            with open(temp_output, "rb") as f:
                return f.read()

        finally:
            # Clean up temporary files
            if os.path.exists(temp_input):
                os.remove(temp_input)
            if os.path.exists(temp_output):
                os.remove(temp_output) 

    async def process_metadata(
        self,
        file: UploadFile,
        action: str,
        metadata: Optional[str] = None
    ) -> dict:
        """Process metadata operations"""
        try:
            content = await file.read()
            
            if action == "view":
                return self._extract_metadata(content, file.content_type)
            elif action == "add":
                return self._add_metadata(content, file.content_type, json.loads(metadata))
            elif action == "remove":
                return self._remove_metadata(content, file.content_type)
            else:
                raise ValueError("Invalid metadata action")
                
        except Exception as e:
            raise ValueError(f"Metadata operation failed: {str(e)}")

    def _extract_metadata(self, content: bytes, content_type: str) -> dict:
        """Extract metadata from file"""
        if content_type in self.ALLOWED_IMAGE_TYPES:
            img = Image.open(io.BytesIO(content))
            metadata = {}
            
            # Extract EXIF data
            if "exif" in img.info:
                exif_dict = piexif.load(img.info["exif"])
                for ifd in exif_dict:
                    if isinstance(exif_dict[ifd], dict):
                        metadata[ifd] = {
                            piexif.TAGS[ifd][tag]["name"]: value
                            for tag, value in exif_dict[ifd].items()
                        }
            
            # Extract other image info
            metadata["format"] = img.format
            metadata["mode"] = img.mode
            metadata["size"] = img.size
            
            return metadata
        else:
            # Extract video metadata using moviepy
            temp_file = "temp_video.mp4"
            try:
                with open(temp_file, "wb") as f:
                    f.write(content)
                video = VideoClip(temp_file)
                return {
                    "duration": video.duration,
                    "fps": video.fps,
                    "size": video.size,
                    "audio": video.audio is not None
                }
            finally:
                if os.path.exists(temp_file):
                    os.remove(temp_file)

    async def compress_media(
        self,
        file: UploadFile,
        quality: int = 80,
        maintain_metadata: bool = True
    ) -> bytes:
        """Compress media file"""
        try:
            content = await file.read()
            
            if file.content_type in self.ALLOWED_IMAGE_TYPES:
                return self._compress_image(content, quality, maintain_metadata)
            elif file.content_type in self.ALLOWED_VIDEO_TYPES:
                return self._compress_video(content, quality)
            else:
                raise ValueError("Unsupported file type")
                
        except Exception as e:
            raise ValueError(f"Compression failed: {str(e)}")

    def _compress_image(
        self,
        content: bytes,
        quality: int,
        maintain_metadata: bool
    ) -> bytes:
        """Compress image"""
        img = Image.open(io.BytesIO(content))
        
        # Save original metadata if needed
        original_exif = None
        if maintain_metadata and "exif" in img.info:
            original_exif = img.info["exif"]
        
        output = io.BytesIO()
        
        # Save with compression
        save_kwargs = {"quality": quality}
        if original_exif:
            save_kwargs["exif"] = original_exif
            
        img.save(output, format=img.format, optimize=True, **save_kwargs)
        return output.getvalue()

    async def convert_format(
        self,
        file: UploadFile,
        target_format: str
    ) -> bytes:
        """Convert media format"""
        try:
            content = await file.read()
            
            if file.content_type in self.ALLOWED_IMAGE_TYPES:
                return self._convert_image(content, target_format)
            elif file.content_type in self.ALLOWED_VIDEO_TYPES:
                return self._convert_video(content, target_format)
            else:
                raise ValueError("Unsupported file type")
                
        except Exception as e:
            raise ValueError(f"Conversion failed: {str(e)}")

    def _convert_image(self, content: bytes, target_format: str) -> bytes:
        """Convert image to target format"""
        try:
            img = Image.open(io.BytesIO(content))
            output = io.BytesIO()
            
            # Convert to RGB if needed (for JPEG)
            if target_format.lower() == 'jpeg' and img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Save in target format
            img.save(output, format=target_format.upper())
            return output.getvalue()
        except Exception as e:
            raise ValueError(f"Image conversion failed: {str(e)}")

    def _convert_video(self, content: bytes, target_format: str) -> bytes:
        """Convert video to target format"""
        temp_input = "temp_input_video"
        temp_output = f"temp_output_video.{target_format}"
        
        try:
            # Save input video temporarily
            with open(temp_input, "wb") as f:
                f.write(content)
            
            # Convert using moviepy
            video = VideoClip(temp_input)
            
            # Set codec based on target format
            if target_format == 'mp4':
                video.write_videofile(temp_output, codec='libx264')
            elif target_format == 'webm':
                video.write_videofile(temp_output, codec='libvpx')
            else:
                raise ValueError(f"Unsupported video format: {target_format}")
            
            # Read the converted file
            with open(temp_output, "rb") as f:
                return f.read()
                
        except Exception as e:
            raise ValueError(f"Video conversion failed: {str(e)}")
            
        finally:
            # Clean up temporary files
            if os.path.exists(temp_input):
                os.remove(temp_input)
            if os.path.exists(temp_output):
                os.remove(temp_output)

    def _compress_video(self, content: bytes, quality: int) -> bytes:
        """Compress video"""
        temp_input = "temp_input_video"
        temp_output = "temp_output_video.mp4"
        
        try:
            # Save input video temporarily
            with open(temp_input, "wb") as f:
                f.write(content)
            
            # Compress using moviepy
            video = VideoClip(temp_input)
            
            # Calculate bitrate based on quality (quality is 1-100)
            max_bitrate = "5000k"  # 5Mbps
            bitrate = f"{int(5000 * (quality/100))}k"
            
            # Write compressed video
            video.write_videofile(
                temp_output,
                codec='libx264',
                bitrate=bitrate,
                audio_codec='aac'
            )
            
            # Read the compressed file
            with open(temp_output, "rb") as f:
                return f.read()
                
        except Exception as e:
            raise ValueError(f"Video compression failed: {str(e)}")
            
        finally:
            # Clean up temporary files
            if os.path.exists(temp_input):
                os.remove(temp_input)
            if os.path.exists(temp_output):
                os.remove(temp_output)

media_service = MediaService()

@router.post("/watermark")
async def add_watermark(
    file: UploadFile = File(...),
    text: str = Form(...),
    position: str = Form("bottom-right"),
    opacity: int = Form(50)
):
    """Add watermark to media file"""
    try:
        result = await media_service.process_watermark(file, text, position, opacity)
        return StreamingResponse(
            io.BytesIO(result),
            media_type=file.content_type
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/metadata")
async def process_metadata(
    file: UploadFile = File(...),
    action: str = Form(...),
    metadata: Optional[str] = Form(None)
):
    """Process metadata operations"""
    try:
        result = await media_service.process_metadata(file, action, metadata)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/compress")
async def compress_media(
    file: UploadFile = File(...),
    quality: int = Form(80),
    maintain_metadata: bool = Form(True)
):
    """Compress media file"""
    try:
        result = await media_service.compress_media(file, quality, maintain_metadata)
        return StreamingResponse(
            io.BytesIO(result),
            media_type=file.content_type
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/convert")
async def convert_to_format(
    file: UploadFile = File(...),
    target_format: str = Form(...)
):
    """Convert media format"""
    try:
        result = await media_service.convert_format(file, target_format)
        return StreamingResponse(
            io.BytesIO(result),
            media_type=f"image/{target_format}" if target_format in ["jpeg", "png", "webp", "gif"]
            else f"video/{target_format}"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) 