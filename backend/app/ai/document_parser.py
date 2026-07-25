import io
import email
from email import policy
import pdfplumber
import docx

def parse_document(filename: str, file_bytes: bytes) -> str:
    """
    Main entry point. Routes the byte stream to the correct 
    parser based on the file extension.
    """
    if not filename or not file_bytes:
        return ""

    # Extract the extension (e.g., "complaint.pdf" -> "pdf")
    ext = filename.lower().split('.')[-1]
    
    try:
        if ext == 'pdf':
            return parse_pdf(file_bytes)
        elif ext in ['docx', 'doc']:
            return parse_docx(file_bytes)
        elif ext == 'eml':
            return parse_eml(file_bytes)
        elif ext == 'txt':
            return parse_txt(file_bytes)
        else:
            raise ValueError(f"Unsupported file format: {ext}. Please upload PDF, DOCX, TXT, or EML.")
    except Exception as e:
        return f"Error extracting text from document: {str(e)}"


def parse_pdf(file_bytes: bytes) -> str:
    """Extracts text from PDF files."""
    text = ""
    # Wrap bytes in BytesIO so pdfplumber treats it like a file
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


def parse_docx(file_bytes: bytes) -> str:
    """Extracts text from Word documents."""
    # Load the document from the byte stream
    doc = docx.Document(io.BytesIO(file_bytes))
    
    # Extract text from every paragraph
    full_text = []
    for para in doc.paragraphs:
        if para.text.strip():
            full_text.append(para.text.strip())
            
    return "\n".join(full_text)


def parse_eml(file_bytes: bytes) -> str:
    """
    Extracts data from email files (.eml).
    Includes Subject, Sender, and Date as they are highly relevant to complaints.
    """
    # Parse the email bytes with the default policy to handle headers correctly
    msg = email.message_from_bytes(file_bytes, policy=policy.default)
    
    # Extract important metadata for the AI
    subject = msg.get('subject', 'No Subject')
    sender = msg.get('from', 'Unknown Sender')
    date = msg.get('date', 'Unknown Date')
    
    body = ""
    
    # Emails can be multipart (HTML + Plain Text + Attachments)
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))
            
            # We target the plain text body and ignore attachments
            if content_type == "text/plain" and "attachment" not in content_disposition:
                try:
                    charset = part.get_content_charset() or 'utf-8'
                    body = part.get_payload(decode=True).decode(charset)
                    break # Stop after finding the primary text body
                except Exception:
                    continue
    else:
        # Not multipart, just decode the payload
        charset = msg.get_content_charset() or 'utf-8'
        body = msg.get_payload(decode=True).decode(charset)
        
    # Format the extracted email nicely for the LLM
    extracted_email = f"Email Date: {date}\n" \
                      f"Sender: {sender}\n" \
                      f"Subject: {subject}\n\n" \
                      f"Email Body:\n{body.strip()}"
                      
    return extracted_email


def parse_txt(file_bytes: bytes) -> str:
    """Extracts text from standard text files."""
    # Ignore errors for characters that might not strictly adhere to utf-8
    return file_bytes.decode('utf-8', errors='ignore').strip()