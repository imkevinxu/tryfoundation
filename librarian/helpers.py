
from librarian.models import *
import md5

def create_user_profile(user, email):
    profile = UserProfile(user=user)
    profile.gravatar = "http://www.gravatar.com/avatar/%s.jpg" % md5.new(email.strip().lower()).hexdigest()
    profile.save()
    return profile

def create_user_completions(user):
	lessons = Lesson.objects.all()
	for lesson in lessons:
		completion = LessonCompletion(user=user, lesson=lesson)
		completion.save()
	return LessonCompletion.objects.filter(user=user)