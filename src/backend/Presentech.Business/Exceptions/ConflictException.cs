namespace Presentech.Business.Exceptions
{
    public class ConflictException : BusinessException
    {
        public ConflictException(string message) : base(message) { }
    }
}
