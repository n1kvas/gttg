document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const generatedText = document.getElementById('generatedText');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const previewScaler = document.getElementById('previewScaler');
    const exportButton = document.getElementById('exportButton');

    // Controls
    const fontSizeInput = document.getElementById('fontSize');
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontWeightSelect = document.getElementById('fontWeight');
    const textAlignSelect = document.getElementById('textAlign');
    const justifyContentSelect = document.getElementById('justifyContent');
    const lineHeightInput = document.getElementById('lineHeight');
    const letterSpacingInput = document.getElementById('letterSpacing');
    const thumbnailWidthInput = document.getElementById('thumbnailWidth');
    const gradientToggleSelect = document.getElementById('gradientToggle');
    const bgColorInput = document.getElementById('bgColor');
    const bgTransparencyInput = document.getElementById('bgTransparency');
    const transparencyValueDisplay = document.getElementById('transparencyValue');
    const transparencyWarning = document.getElementById('transparencyWarning');
    const exportFormatSelect = document.getElementById('exportFormat');
    const cornerRadiusInput = document.getElementById('cornerRadius');
    const outlineTypeSelect = document.getElementById('outlineType');
    const outlineThicknessInput = document.getElementById('outlineThickness');
    const themeSelect = document.getElementById('themeSelect');
    const textPosXInput = document.getElementById('textPosX');
    const textPosYInput = document.getElementById('textPosY');
    const resetPosXBtn = document.getElementById('resetPosX');
    const resetPosYBtn = document.getElementById('resetPosY');
    const posXValueDisplay = document.getElementById('posXValue');
    const posYValueDisplay = document.getElementById('posYValue');

    function updatePreview() {
        // Define text variable at the start
        const text = textInput.value;
        
        // For direct editing, we don't need to update the text content
        // as it's directly edited in the preview. We only need to sync if loading from saved settings.
        if (!document.activeElement || document.activeElement !== generatedText) {
            // Use the text variable defined above
            if (text && generatedText.innerText !== text) {
                generatedText.innerText = text;
            }
        }
        
        // Apply styles from controls
        const fontSize = fontSizeInput.value + 'px';
        const fontFamily = fontFamilySelect.value;
        const fontWeight = fontWeightSelect.value;
        const textAlign = textAlignSelect.value;
        const justifyContent = justifyContentSelect.value; // For the container
        const lineHeight = lineHeightInput.value;
        const letterSpacing = letterSpacingInput.value + 'px';
        const targetCanvasSize = parseInt(thumbnailWidthInput.value, 10) || 500;
        
        // Measure container size
        const rect = thumbnailContainer.getBoundingClientRect();
        const previewSize = Math.min(rect.width, rect.height);
        const scale = previewSize / targetCanvasSize;
        
        const gradientType = gradientToggleSelect.value;
        const bgColor = bgColorInput.value;
        const transparency = bgTransparencyInput.value;
        const exportFormat = exportFormatSelect.value;
        const cornerRadius = (parseInt(cornerRadiusInput.value, 10) * scale) + 'px';
        const outlineType = outlineTypeSelect.value;
        const outlineThickness = parseInt(outlineThicknessInput.value, 10);
        const textPosX = textPosXInput.value;
        const textPosY = textPosYInput.value;

        // Update transparency display
        transparencyValueDisplay.textContent = transparency + '%';
        posXValueDisplay.textContent = textPosX + '%';
        posYValueDisplay.textContent = textPosY + '%';
        
        // Show warning if transparency is used with JPG
        if (transparency > 0 && exportFormat === 'jpg') {
            transparencyWarning.classList.add('visible');
        } else {
            transparencyWarning.classList.remove('visible');
        }

        // Apply scale to preview content
        previewScaler.style.width = targetCanvasSize + 'px';
        previewScaler.style.height = targetCanvasSize + 'px';
        previewScaler.style.transform = `translate(-50%, -50%) scale(${scale})`;
        previewScaler.style.position = 'absolute';
        previewScaler.style.left = '50%';
        previewScaler.style.top = '50%';
        previewScaler.style.transformOrigin = 'center center';
        previewScaler.style.marginLeft = '0';
        previewScaler.style.marginTop = '0';

        generatedText.style.fontSize = fontSize;
        generatedText.style.fontFamily = fontFamily;
        generatedText.style.fontWeight = fontWeight;
        generatedText.style.textAlign = textAlign;
        generatedText.style.lineHeight = lineHeight;
        generatedText.style.letterSpacing = letterSpacing;
        
        // Positioning using absolute coords
        generatedText.style.position = 'absolute';
        generatedText.style.left = textPosX + '%';
        generatedText.style.top = textPosY + '%';
        generatedText.style.transform = `translate(-${textPosX}%, -${textPosY}%)`;
        
        // Apply background color with transparency
        const hexColor = bgColor;
        // Convert hex to rgba
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const alpha = 1 - (transparency / 100);
        thumbnailContainer.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        thumbnailContainer.style.borderRadius = (parseInt(cornerRadiusInput.value, 10) * scale) + 'px';

        // Reset all styles first
        thumbnailContainer.classList.remove('gradient-outline-active');
        thumbnailContainer.style.setProperty('--outline-gradient', 'transparent');
        thumbnailContainer.style.setProperty('--outline-thickness', '0px');
        thumbnailContainer.style.border = 'none';

        // Apply outline based on selection
        if (outlineType === 'none') {
            thumbnailContainer.style.border = `${2 * scale}px dashed var(--accent-color)`;
        } else if (outlineType === 'gradient' && outlineThickness > 0) {
            thumbnailContainer.classList.add('gradient-outline-active');
            thumbnailContainer.style.border = 'none'; // Remove default border if gradient is active

            let gradientCSS = '';
            // Use the same gradient logic as for text, but for background-image
            switch(gradientType) {
                case 'wd': gradientCSS = 'linear-gradient(to right, #ff6bc1, #8D38C9, #2196f3)'; break;
                case 'gemini': gradientCSS = 'linear-gradient(to right, #4285f4, #8D38C9, #f06154)'; break;
                case 'sunset': gradientCSS = 'linear-gradient(to right, #ff8c00, #ff5500, #ff0080, #ff00ff)'; break;
                case 'ocean': gradientCSS = 'linear-gradient(to right, #00c6ff, #0072ff, #0040ff, #5e2eff)'; break;
                case 'forest': gradientCSS = 'linear-gradient(to right, #78d64b, #36b677, #0095a8, #0077c2)'; break;
                case 'candy': gradientCSS = 'linear-gradient(to right, #ff61d2, #fe9090, #feb57b, #ffffff)'; break;
                case 'rainbow': gradientCSS = 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)'; break;
                case 'neon': gradientCSS = 'linear-gradient(to right, #f00fbc, #00fff0)'; break;
                case 'greyscale': gradientCSS = 'linear-gradient(to right, #000000, #777777, #ffffff)'; break;
                default: gradientCSS = 'transparent'; // Should not happen if outline is gradient
            }
            thumbnailContainer.style.setProperty('--outline-gradient', gradientCSS);
            thumbnailContainer.style.setProperty('--outline-thickness', `${outlineThickness * scale}px`);
        }
        
        // Remove all gradient classes first
        generatedText.classList.remove(
            'wd-gradient',
            'gemini-gradient', 
            'sunset-gradient', 
            'ocean-gradient', 
            'forest-gradient',
            'candy-gradient',
            'rainbow-gradient',
            'neon-gradient',
            'greyscale-gradient'
        );
        
        // Apply selected gradient
        if (gradientType !== 'none') {
            generatedText.classList.add(`${gradientType}-gradient`);
            // Make sure text uses the gradient
            generatedText.style.color = "transparent";
            generatedText.style.webkitTextFillColor = "transparent";
        } else {
            // For "None" option, restore solid text color
            generatedText.style.background = "none";
            generatedText.style.webkitBackgroundClip = "border-box";
            generatedText.style.backgroundClip = "border-box";
            generatedText.style.color = "var(--text-color)";
            generatedText.style.webkitTextFillColor = "var(--text-color)";
        }
        
        // Vertical alignment for the text within its own box (if it doesn't fill the container)
        // For more complex scenarios, the #generatedText might also need to be a flex container.
        // For now, we adjust the parent's flex properties.
        previewScaler.style.alignItems = justifyContent; // Maps to flex-start, center, flex-end
        previewScaler.style.justifyContent = textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center';

        // Use the text variable defined at the start
        if (!text) {
            // If generatedText is empty and not focused, set placeholder
            if (generatedText.innerText.trim() === '' && document.activeElement !== generatedText) {
                 generatedText.innerText = ""; // Clear to show placeholder CSS
            }
        } else if (generatedText.innerText.trim() === '' && document.activeElement !== generatedText) {
            // Handle case where textInput has value but generatedText was cleared
            generatedText.innerText = text; 
        }
    }

    // Make the generatedText div sync with the textarea
    generatedText.addEventListener('input', function() {
        textInput.value = generatedText.innerText;
        saveOnChange(); // Save the changes to localStorage
    });
    
    // When clicking on the preview area, focus the contenteditable div
    thumbnailContainer.addEventListener('click', function(e) {
        // Only focus if clicking the container, not an element inside it
        if (e.target === thumbnailContainer) {
            generatedText.focus();
        }
    });
    
    // Event Listeners for controls
    // Note: We don't need to listen to textInput changes anymore as it's not directly edited
    fontSizeInput.addEventListener('input', updatePreview);
    fontFamilySelect.addEventListener('change', updatePreview);
    fontWeightSelect.addEventListener('change', updatePreview);
    textAlignSelect.addEventListener('change', updatePreview);
    justifyContentSelect.addEventListener('change', updatePreview);
    lineHeightInput.addEventListener('input', updatePreview);
    letterSpacingInput.addEventListener('input', updatePreview);
    thumbnailWidthInput.addEventListener('input', updatePreview);
    gradientToggleSelect.addEventListener('change', updatePreview);
    bgColorInput.addEventListener('input', updatePreview);
    bgTransparencyInput.addEventListener('input', updatePreview);
    exportFormatSelect.addEventListener('change', updatePreview);
    cornerRadiusInput.addEventListener('input', updatePreview);
    outlineTypeSelect.addEventListener('change', updatePreview);
    outlineThicknessInput.addEventListener('input', updatePreview);
    textPosXInput.addEventListener('input', updatePreview);
    textPosYInput.addEventListener('input', updatePreview);
    
    resetPosXBtn.addEventListener('click', () => {
        textPosXInput.value = 50;
        updatePreview();
        saveOnChange();
    });
    
    resetPosYBtn.addEventListener('click', () => {
        textPosYInput.value = 50;
        updatePreview();
        saveOnChange();
    });

    // Export functionality
    exportButton.addEventListener('click', () => {
        if (textInput.value.trim() === '') {
            alert("Please enter some text before exporting.");
            return;
        }

        const size = parseInt(thumbnailWidthInput.value, 10);
        const cornerRadius = parseInt(cornerRadiusInput.value, 10);
        const outlineType = outlineTypeSelect.value;
        const outlineThickness = parseInt(outlineThicknessInput.value, 10);
        const exportFormat = exportFormatSelect.value;
        const gradientType = gradientToggleSelect.value; // For outline gradient
        const bgColor = bgColorInput.value;
        const transparency = parseInt(bgTransparencyInput.value, 10);

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // --- Helper to create rounded rect path ---
        function createRoundedRectPath(x, y, width, height, radius) {
            const path = new Path2D();
            if (radius === 0) {
                path.rect(x, y, width, height);
            } else {
                path.moveTo(x + radius, y);
                path.lineTo(x + width - radius, y);
                path.arcTo(x + width, y, x + width, y + radius, radius);
                path.lineTo(x + width, y + height - radius);
                path.arcTo(x + width, y + height, x + width - radius, y + height, radius);
                path.lineTo(x + radius, y + height);
                path.arcTo(x, y + height, x, y + height - radius, radius);
                path.lineTo(x, y + radius);
                path.arcTo(x, y, x + radius, y, radius);
                path.closePath();
            }
            return path;
        }

        // --- 1. Draw Gradient Outline (if active) ---
        if (outlineType === 'gradient' && outlineThickness > 0) {
            let outlineGradientColors = [];
            switch(gradientType) {
                case 'wd': outlineGradientColors = ['#ff6bc1', '#8D38C9', '#2196f3']; break; // Web Design gradient
                case 'gemini': outlineGradientColors = ['#4285f4', '#8D38C9', '#f06154']; break;
                case 'sunset': outlineGradientColors = ['#ff8c00', '#ff5500', '#ff0080', '#ff00ff']; break;
                case 'ocean': outlineGradientColors = ['#00c6ff', '#0072ff', '#0040ff', '#5e2eff']; break;
                case 'forest': outlineGradientColors = ['#78d64b', '#36b677', '#0095a8', '#0077c2']; break;
                case 'candy': outlineGradientColors = ['#ff61d2', '#fe9090', '#feb57b', '#ffffff']; break;
                case 'rainbow': outlineGradientColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']; break;
                case 'neon': outlineGradientColors = ['#f00fbc', '#00fff0']; break;
                case 'greyscale': outlineGradientColors = ['#000000', '#777777', '#ffffff']; break;
                default: outlineGradientColors = ['transparent'];
            }

            if (outlineGradientColors.length > 0 && outlineGradientColors[0] !== 'transparent') {
                const canvasGradient = ctx.createLinearGradient(0, 0, size, size); // Diagonal gradient often looks good for borders
                outlineGradientColors.forEach((color, i) => {
                    canvasGradient.addColorStop(i / (outlineGradientColors.length - 1 || 1), color);
                });
                ctx.strokeStyle = canvasGradient;
                ctx.lineWidth = outlineThickness;
                
                // Path for stroking (center of the line)
                const strokePath = createRoundedRectPath(
                    outlineThickness / 2,
                    outlineThickness / 2,
                    size - outlineThickness,
                    size - outlineThickness,
                    Math.max(0, cornerRadius - outlineThickness / 2)
                );
                ctx.stroke(strokePath);
            }
        }

        // --- 2. Draw Background Color ---
        const bgPathX = outlineType === 'gradient' && outlineThickness > 0 ? outlineThickness : 0;
        const bgPathY = outlineType === 'gradient' && outlineThickness > 0 ? outlineThickness : 0;
        const bgPathWidth = size - (outlineType === 'gradient' && outlineThickness > 0 ? outlineThickness * 2 : 0);
        const bgPathHeight = size - (outlineType === 'gradient' && outlineThickness > 0 ? outlineThickness * 2 : 0);
        const bgCornerRadius = Math.max(0, cornerRadius - (outlineType === 'gradient' && outlineThickness > 0 ? outlineThickness : 0));

        const bgPath = createRoundedRectPath(bgPathX, bgPathY, bgPathWidth, bgPathHeight, bgCornerRadius);
        
        // Clear canvas for PNG transparency
        if (transparency > 0 && exportFormat === 'png') {
             // Don't clear if we drew a gradient border, clip instead.
            if (!(outlineType === 'gradient' && outlineThickness > 0)) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        const r = parseInt(bgColor.slice(1, 3), 16);
        const g = parseInt(bgColor.slice(3, 5), 16);
        const b = parseInt(bgColor.slice(5, 7), 16);
        let alpha = 1 - (transparency / 100);

        // Match the background color from the preview
        // Get computed background color from the thumbnail container to ensure consistency
        const computedStyle = window.getComputedStyle(thumbnailContainer);
        const previewBgColor = computedStyle.backgroundColor;

        if (exportFormat === 'jpg') {
            if (alpha === 0) { // Fully transparent for JPG means white
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            }
            alpha = 1; // JPG doesn't support alpha, so effectively it's 1
        } else { // PNG
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            // If we're in dark mode, ensure we use the proper background color
            if (document.body.getAttribute('data-theme') === 'dark' && alpha > 0) {
                ctx.fillStyle = previewBgColor;
            }
        }

        // If there's an outline, we need to clip the background drawing to be inside it.
        if (outlineType === 'gradient' && outlineThickness > 0) {
            ctx.save();
            ctx.clip(bgPath); // Clip to the inner area
            ctx.fillRect(0, 0, size, size); // Fill the whole canvas, it will be clipped
            ctx.restore();
        } else {
            // If no outline, fill the background path directly
            ctx.fill(bgPath);
        }


        // --- 3. Draw Text ---
        const displayedText = generatedText.innerText;
        const currentFontSize = parseInt(fontSizeInput.value, 10);
        const currentFontFamily = fontFamilySelect.value;
        const currentFontWeight = fontWeightSelect.value;
        const currentTextAlign = textAlignSelect.value;
        const currentLineHeightFactor = parseFloat(lineHeightInput.value);
        const currentLetterSpacing = parseFloat(letterSpacingInput.value);
        const currentJustifyContent = justifyContentSelect.value;
        const currentTextPosX = parseFloat(textPosXInput.value) / 100;
        const currentTextPosY = parseFloat(textPosYInput.value) / 100;

        ctx.font = `${currentFontWeight} ${currentFontSize}px ${currentFontFamily}`;

        let textGradientColors = []; // For text gradient
        switch(gradientType) {
            case 'wd': textGradientColors = ['#ff6bc1', '#8D38C9', '#2196f3']; break; // Web Design gradient
            case 'gemini': textGradientColors = ['#4285f4', '#8D38C9', '#f06154']; break;
            case 'sunset': textGradientColors = ['#ff8c00', '#ff5500', '#ff0080', '#ff00ff']; break;
            case 'ocean': textGradientColors = ['#00c6ff', '#0072ff', '#0040ff', '#5e2eff']; break;
            case 'forest': textGradientColors = ['#78d64b', '#36b677', '#0095a8', '#0077c2']; break;
            case 'candy': textGradientColors = ['#ff61d2', '#fe9090', '#feb57b', '#ffffff']; break;
            case 'rainbow': textGradientColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']; break;
            case 'neon': textGradientColors = ['#f00fbc', '#00fff0']; break;
            case 'greyscale': textGradientColors = ['#000000', '#777777', '#ffffff']; break;
            default: textGradientColors = [ctx.fillStyle]; // Fallback to background or solid text color if no text gradient
        }
        if (gradientToggleSelect.value === 'none') {
            // For 'none' gradient, use the current theme's text color
            // Get the computed text color from CSS variables
            const computedStyle = window.getComputedStyle(document.body);
            const themeTextColor = computedStyle.getPropertyValue('--text-color').trim();
            
            // Use theme color or fallback to automatic contrast based on background
            if (themeTextColor) {
                ctx.fillStyle = themeTextColor;
            } else {
                const perceivedLightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                ctx.fillStyle = perceivedLightness > 0.5 ? '#000000' : '#ffffff';
            }
            
            if (alpha === 0 && exportFormat === 'jpg') ctx.fillStyle = '#000000';
        }

        // Calculate lines for text drawing (respecting container padding for text)
        const textContainerPadding = 10; // As in #generatedText CSS
        const textAvailableWidth = size - (textContainerPadding * 2); // Match preview width

        const lines = [];
        let currentLine = '';

        const getTextWidth = (text) => {
            if (currentLetterSpacing > 0) {
                return Array.from(text).reduce((w, char) => w + ctx.measureText(char).width + currentLetterSpacing, 0) - (text.length > 0 ? currentLetterSpacing : 0);
            }
            return ctx.measureText(text).width;
        };

        const paragraphs = displayedText.split('\n');
        for (const paragraph of paragraphs) {
            const words = paragraph.split(/\s+/);
            if (words.length === 0 || (words.length === 1 && words[0] === '')) {
                lines.push(''); continue;
            }
            currentLine = '';
            for (const word of words) {
                const wordWidth = getTextWidth(word);
                const spaceWidth = getTextWidth(' ');
                if (currentLine === '') {
                    currentLine = word;
                } else if (getTextWidth(currentLine) + spaceWidth + wordWidth <= textAvailableWidth) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine !== '') lines.push(currentLine);
        }

        let effectiveFontSize = currentFontSize;
        const maxTextLineWidth = Math.max(...lines.map(line => getTextWidth(line)), 0);

        if (maxTextLineWidth > textAvailableWidth && textAvailableWidth > 0) {
            const scaleFactor = textAvailableWidth / maxTextLineWidth;
            effectiveFontSize = Math.floor(currentFontSize * scaleFactor);
            ctx.font = `${currentFontWeight} ${effectiveFontSize}px ${currentFontFamily}`;
        }

        const effectiveLineHeight = effectiveFontSize * currentLineHeightFactor;

        // Get accurate metrics for vertical positioning to match CSS behavior
        const metrics = ctx.measureText('M');
        // Use fontBoundingBox if available as it's much closer to how browsers position text
        const fontAscent = metrics.fontBoundingBoxAscent || (effectiveFontSize * 0.8);
        const fontDescent = metrics.fontBoundingBoxDescent || (effectiveFontSize * 0.2);
        const fontHeight = fontAscent + fontDescent;
        const halfLeading = (effectiveLineHeight - fontHeight) / 2;

        let startY;
        // Total height of the simulated #generatedText div
        const totalContentHeight = (lines.length * effectiveLineHeight) + (textContainerPadding * 2);

        // Use the precise X/Y position sliders
        const topOfFirstLineBox = (size * currentTextPosY) - (totalContentHeight * currentTextPosY) + textContainerPadding;
        startY = topOfFirstLineBox + halfLeading + fontAscent;

        // Fix text alignment to match preview
        let textAlignCanvas;
        if (currentTextAlign === 'left') {
            textAlignCanvas = 'left';
        } else if (currentTextAlign === 'right') {
            textAlignCanvas = 'right';
        } else { // center
            textAlignCanvas = 'center';
        }
        ctx.textAlign = textAlignCanvas;

        lines.forEach((line, index) => {
            let startX;
            const lineTextWidth = getTextWidth(line); // Recalculate with potentially new font size

            // Horizontal position based on slider
            const textBlockWidth = lineTextWidth + (textContainerPadding * 2);
            
            if (textAlignCanvas === 'left') {
                startX = (size * currentTextPosX) - (textBlockWidth * currentTextPosX) + textContainerPadding;
            } else if (textAlignCanvas === 'right') {
                startX = (size * currentTextPosX) - (textBlockWidth * currentTextPosX) + textBlockWidth - textContainerPadding;
            } else { // Center
                startX = (size * currentTextPosX) - (textBlockWidth * currentTextPosX) + (textBlockWidth / 2);
            }
            
            if (gradientToggleSelect.value !== 'none' && textGradientColors.length > 0) {
                // For gradients, we need to create the gradient based on alignment
                let gradientStartX, gradientEndX;
                
                if (textAlignCanvas === 'left') {
                    gradientStartX = startX;
                    gradientEndX = startX + lineTextWidth;
                } else if (textAlignCanvas === 'right') {
                    gradientStartX = startX - lineTextWidth;
                    gradientEndX = startX;
                } else { // center
                    gradientStartX = startX - lineTextWidth / 2;
                    gradientEndX = startX + lineTextWidth / 2;
                }
                
                const textCanvasGradient = ctx.createLinearGradient(gradientStartX, 0, gradientEndX, 0);
                textGradientColors.forEach((color, i) => {
                    textCanvasGradient.addColorStop(i / (textGradientColors.length - 1 || 1), color);
                });
                ctx.fillStyle = textCanvasGradient;
            }

            if (line === '') return;

            if (currentLetterSpacing > 0) {
                // For letter spacing, we need to calculate positions manually
                let charX;
                const chars = Array.from(line);
                
                if (textAlignCanvas === 'left') {
                    charX = startX;
                } else if (textAlignCanvas === 'right') {
                    // For right-aligned text, start from right edge minus total width
                    charX = startX - lineTextWidth;
                } else { // center
                    // For center-aligned text, start from center minus half the total width
                    charX = startX - lineTextWidth / 2;
                }
                
                for (let char of chars) {
                    ctx.fillText(char, charX, startY + index * effectiveLineHeight);
                    charX += ctx.measureText(char).width + currentLetterSpacing;
                }
            } else {
                ctx.fillText(line, startX, startY + index * effectiveLineHeight);
            }
        });

        // --- 4. Convert canvas to image and download ---
        const finalImageFormat = exportFormatSelect.value;
        const imageDataURL = canvas.toDataURL(`image/${finalImageFormat}`, finalImageFormat === 'jpg' ? 0.92 : 1.0);
        const link = document.createElement('a');
        link.href = imageDataURL;
        link.download = `gemini-thumbnail.${finalImageFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Theme switching
    function setTheme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.body.setAttribute('data-theme', theme);
        }
        // Save theme preference
        localStorage.setItem('preferred-theme', theme);
    }

    // Initialize theme from saved preference or system default
    function initTheme() {
        const savedTheme = localStorage.getItem('preferred-theme') || 'system';
        themeSelect.value = savedTheme;
        setTheme(savedTheme);
    }

    // Listen for theme changes
    themeSelect.addEventListener('change', () => {
        setTheme(themeSelect.value);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (themeSelect.value === 'system') {
            setTheme('system');
        }
    });

    // Initialize theme and preview
    initTheme();
    updatePreview();
    
    // Save settings to localStorage
    function saveSettings() {
        const settings = {
            fontSize: fontSizeInput.value,
            fontFamily: fontFamilySelect.value,
            fontWeight: fontWeightSelect.value,
            textPosX: textPosXInput.value,
            textPosY: textPosYInput.value,
            textAlign: textAlignSelect.value,
            justifyContent: justifyContentSelect.value,
            lineHeight: lineHeightInput.value,
            letterSpacing: letterSpacingInput.value,
            thumbnailWidth: thumbnailWidthInput.value,
            gradientType: gradientToggleSelect.value,
            bgColor: bgColorInput.value,
            bgTransparency: bgTransparencyInput.value,
            exportFormat: exportFormatSelect.value,
            cornerRadius: cornerRadiusInput.value,
            outlineType: outlineTypeSelect.value,
            outlineThickness: outlineThicknessInput.value,
            text: textInput.value
        };
        
        localStorage.setItem('gemini-text-generator-settings', JSON.stringify(settings));
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('gemini-text-generator-settings');
        
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                
                // Apply saved settings to inputs
                if (settings.fontSize) fontSizeInput.value = settings.fontSize;
                if (settings.fontFamily) fontFamilySelect.value = settings.fontFamily;
                if (settings.fontWeight) fontWeightSelect.value = settings.fontWeight;
                if (settings.textPosX) textPosXInput.value = settings.textPosX;
                if (settings.textPosY) textPosYInput.value = settings.textPosY;
                if (settings.textAlign) textAlignSelect.value = settings.textAlign;
                if (settings.justifyContent) justifyContentSelect.value = settings.justifyContent;
                if (settings.lineHeight) lineHeightInput.value = settings.lineHeight;
                if (settings.letterSpacing) letterSpacingInput.value = settings.letterSpacing;
                if (settings.thumbnailWidth) thumbnailWidthInput.value = settings.thumbnailWidth;
                if (settings.gradientType) gradientToggleSelect.value = settings.gradientType;
                if (settings.bgColor) bgColorInput.value = settings.bgColor;
                if (settings.bgTransparency) bgTransparencyInput.value = settings.bgTransparency;
                if (settings.exportFormat) exportFormatSelect.value = settings.exportFormat;
                if (settings.cornerRadius) cornerRadiusInput.value = settings.cornerRadius;
                if (settings.outlineType) outlineTypeSelect.value = settings.outlineType;
                if (settings.outlineThickness) outlineThicknessInput.value = settings.outlineThickness;
                if (settings.text) {
                    textInput.value = settings.text;
                    generatedText.innerText = settings.text;
                }
                
                // Update the preview with loaded settings
                updatePreview();
            } catch (error) {
                console.error('Error loading saved settings:', error);
            }
        }
    }
    
    // Save settings when any control changes
    function saveOnChange() {
        saveSettings();
    }
    
    // Add save functionality to all controls
    textInput.addEventListener('input', saveOnChange);
    fontSizeInput.addEventListener('input', saveOnChange);
    fontFamilySelect.addEventListener('change', saveOnChange);
    fontWeightSelect.addEventListener('change', saveOnChange);
    textAlignSelect.addEventListener('change', saveOnChange);
    justifyContentSelect.addEventListener('change', saveOnChange);
    lineHeightInput.addEventListener('input', saveOnChange);
    letterSpacingInput.addEventListener('input', saveOnChange);
    thumbnailWidthInput.addEventListener('input', saveOnChange);
    gradientToggleSelect.addEventListener('change', saveOnChange);
    bgColorInput.addEventListener('input', saveOnChange);
    bgTransparencyInput.addEventListener('input', saveOnChange);
    exportFormatSelect.addEventListener('change', saveOnChange);
    cornerRadiusInput.addEventListener('input', saveOnChange);
    outlineTypeSelect.addEventListener('change', saveOnChange);
    outlineThicknessInput.addEventListener('input', saveOnChange);
    textPosXInput.addEventListener('input', saveOnChange);
    textPosYInput.addEventListener('input', saveOnChange);
    
    // Add collapsible functionality for control sections
    const controlSections = document.querySelectorAll('.control-section');
    const isMobile = window.innerWidth <= 768;
    
    controlSections.forEach((section, index) => {
        const header = section.querySelector('h3');
        
        // Collapse all but the first section on mobile by default
        if (isMobile && index > 0) {
            section.classList.add('collapsed');
        }
        
        header.addEventListener('click', () => {
            section.classList.toggle('collapsed');
        });
    });

    // Load saved settings on page initialization
    loadSettings();

    // Update preview on window resize to maintain responsiveness
    window.addEventListener('resize', updatePreview);
});